import { Injectable } from '@nestjs/common';
import path = require('path');
import fs = require('fs');
import { Gateway, Wallets } from 'fabric-network';
import FabricCAServices = require('fabric-ca-client');
import { SubmitContractRequest, ResponseBody, QueryContractRequest } from './app.dto';
import CryptoJS = require('crypto-js');

@Injectable()
export class AppService {
  CCP_PATH = path.resolve(
    '.',
    'crypto-config',
    'peerOrganizations',
    'org1.example.com',
    'connection-org1.json',
  );
  CONTRACT_ID = 'agreements';
  CHANNEL_ID = 'mychannel';

  FUNCTION_NAME = {
    SUBMIT_CONTRACT: 'submitContract',
    QUERY_CONTRACT: 'queryContract',
  };

  getHello(): string {
    return 'Hello World!';
  }

  async registerUser(name: string): Promise<boolean> {
    try {
      // load the network configuration
      const ccp = JSON.parse(fs.readFileSync(this.CCP_PATH, 'utf8'));

      // Create a new CA client for interacting with the CA.
      const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
      const ca = new FabricCAServices(caURL);

      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const userIdentity = await wallet.get(name);
      if (userIdentity) {
        console.log(
          `An identity for the user ${name} already exists in the wallet`,
        );
        return;
      }

      // Check to see if we've already enrolled the admin user.
      const adminIdentity = await wallet.get('admin');
      if (!adminIdentity) {
        console.log(
          'An identity for the admin user "admin" does not exist in the wallet',
        );
        console.log('Run the enrollAdmin.js application before retrying');
        return;
      }
      // build a user object for authenticating with the CA
      const provider = wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, 'admin');

      // Register the user, enroll the user, and import the new identity into the wallet.
      const secret = await ca.register(
        {
          affiliation: 'org1.department1',
          enrollmentID: name,
          role: 'client',
        },
        adminUser,
      );
      const enrollment = await ca.enroll({
        enrollmentID: name,
        enrollmentSecret: secret,
      });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      };
      await wallet.put(name, x509Identity);
      console.log(
        `Successfully registered and enrolled admin user ${name} and imported it into the wallet`,
      );
      return true;
    } catch (error) {
      console.error('\n=====================');
      console.error(`Failed to register user "${name}": ${error}`);
      console.error('=====================\n');
    }
    return false;
  }

  async submitContract(contract: SubmitContractRequest): Promise<ResponseBody> {
    const {
      carId,
      ownerId,
      renterId,
      bookingId,
      fromDate,
      toDate,
      totalPrice,
      carPrice,
      criteria,
      location,
      destination,
    } = contract;
    const keyContract = CryptoJS.MD5(
      `${bookingId}_${carId}_${ownerId}_${renterId}`,
    );
    console.log(contract);
    const criteriaJSON = JSON.stringify(criteria);
    return this.invoke(
      this.FUNCTION_NAME.SUBMIT_CONTRACT,
      keyContract.toString(),
      carId.toString(),
      renterId.toString(),
      ownerId.toString(),
      fromDate.toString(),
      toDate.toString(),
      location,
      destination,
      carPrice.toString(),
      totalPrice.toString(),
      criteriaJSON,
    );
  }

  async queryContract(contract: QueryContractRequest): Promise<ResponseBody> {
    const {
      carId,
      ownerId,
      renterId,
      bookingId,
    } = contract;
    const keyContract = CryptoJS.MD5(
      `${bookingId}_${carId}_${ownerId}_${renterId}`,
    );
    return this.query(this.FUNCTION_NAME.QUERY_CONTRACT, keyContract.toString());
  }
  async query(fnName: string, ...args: string[]): Promise<ResponseBody> {
    const response: ResponseBody = {
      success: false,
      data: '',
    };
    try {
      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      const ccp = JSON.parse(fs.readFileSync(this.CCP_PATH, 'utf8'));
      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);
      await gateway.connect(ccp, {
        wallet,
        identity: 'admin',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(this.CHANNEL_ID);

      // Get the contract from the network.
      const contract = network.getContract(this.CONTRACT_ID);

      // Evaluate the specified transaction.
      // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
      // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
      const result = await contract.evaluateTransaction(fnName, ...args);
      console.log(
        `Transaction has been evaluated, result is: ${result.toString()}`,
      );
      response.success = true;
      response.data = JSON.parse(result.toString());
      return response;
    } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
    }
    return response;
  }

  async invoke(fnName: string, ...args: string[]): Promise<ResponseBody> {
    console.log(args);
    const response: ResponseBody = {
      success: false,
      data: '',
    };
    try {
      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      const ccp = JSON.parse(fs.readFileSync(this.CCP_PATH, 'utf8'));
      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);
      await gateway.connect(ccp, {
        wallet,
        identity: 'admin',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(this.CHANNEL_ID);

      // Get the contract from the network.
      const contract = network.getContract(this.CONTRACT_ID);

      // Submit the specified transaction.
      // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
      // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
      await contract.submitTransaction(fnName, ...args);
      console.log('Transaction has been submitted');
      // Disconnect from the gateway.
      await gateway.disconnect();
      response.success = true;
      return response;
    } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
    }
    return response;
  }
}
