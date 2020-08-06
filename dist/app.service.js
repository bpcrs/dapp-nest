"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const fs = require("fs");
const fabric_network_1 = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const CryptoJS = require("crypto-js");
let AppService = class AppService {
    constructor() {
        this.CCP_PATH = path.resolve('.', 'crypto-config', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        this.CONTRACT_ID = 'agreements';
        this.CHANNEL_ID = 'mychannel';
        this.FUNCTION_NAME = {
            SUBMIT_CONTRACT: 'submitContract',
            QUERY_CONTRACT: 'queryContract',
        };
    }
    getHello() {
        return 'Hello World!';
    }
    async registerUser(name) {
        try {
            const ccp = JSON.parse(fs.readFileSync(this.CCP_PATH, 'utf8'));
            const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
            const ca = new FabricCAServices(caURL);
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await fabric_network_1.Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            const userIdentity = await wallet.get(name);
            if (userIdentity) {
                console.log(`An identity for the user ${name} already exists in the wallet`);
                return;
            }
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Run the enrollAdmin.js application before retrying');
                return;
            }
            const provider = wallet
                .getProviderRegistry()
                .getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');
            const secret = await ca.register({
                affiliation: 'org1.department1',
                enrollmentID: name,
                role: 'client',
            }, adminUser);
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
            console.log(`Successfully registered and enrolled admin user ${name} and imported it into the wallet`);
            return true;
        }
        catch (error) {
            console.error('\n=====================');
            console.error(`Failed to register user "${name}": ${error}`);
            console.error('=====================\n');
        }
        return false;
    }
    async submitContract(contract) {
        const { carId, ownerId, renterId, bookingId, fromDate, toDate, totalPrice, carPrice, criteria, location, destination, } = contract;
        const keyContract = CryptoJS.MD5(`${bookingId}_${carId}_${ownerId}_${renterId}`);
        console.log(contract);
        const criteriaJSON = JSON.stringify(criteria);
        return this.invoke(this.FUNCTION_NAME.SUBMIT_CONTRACT, keyContract.toString(), carId.toString(), renterId.toString(), ownerId.toString(), fromDate.toString(), toDate.toString(), location, destination, carPrice.toString(), totalPrice.toString(), criteriaJSON);
    }
    async queryContract(contract) {
        const { carId, ownerId, renterId, bookingId, } = contract;
        const keyContract = CryptoJS.MD5(`${bookingId}_${carId}_${ownerId}_${renterId}`);
        return this.query(this.FUNCTION_NAME.QUERY_CONTRACT, keyContract.toString());
    }
    async query(fnName, ...args) {
        const response = {
            success: false,
            data: '',
        };
        try {
            const gateway = new fabric_network_1.Gateway();
            const ccp = JSON.parse(fs.readFileSync(this.CCP_PATH, 'utf8'));
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await fabric_network_1.Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            await gateway.connect(ccp, {
                wallet,
                identity: 'admin',
                discovery: { enabled: true, asLocalhost: true },
            });
            const network = await gateway.getNetwork(this.CHANNEL_ID);
            const contract = network.getContract(this.CONTRACT_ID);
            const result = await contract.evaluateTransaction(fnName, ...args);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            response.success = true;
            response.data = JSON.parse(result.toString());
            return response;
        }
        catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
        }
        return response;
    }
    async invoke(fnName, ...args) {
        console.log(args);
        const response = {
            success: false,
            data: '',
        };
        try {
            const gateway = new fabric_network_1.Gateway();
            const ccp = JSON.parse(fs.readFileSync(this.CCP_PATH, 'utf8'));
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await fabric_network_1.Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            await gateway.connect(ccp, {
                wallet,
                identity: 'admin',
                discovery: { enabled: true, asLocalhost: true },
            });
            const network = await gateway.getNetwork(this.CHANNEL_ID);
            const contract = network.getContract(this.CONTRACT_ID);
            await contract.submitTransaction(fnName, ...args);
            console.log('Transaction has been submitted');
            await gateway.disconnect();
            response.success = true;
            return response;
        }
        catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
        }
        return response;
    }
};
AppService = __decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map