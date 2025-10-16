export interface IOrder {
    status: string;
    userId: string;
    amount?: number;
    packageId?: string;
    stripeSubId?: string;
    invoiceUrl?: string;
}


export interface IPackageCredentials {
    primaryIp: string;
    loginPassword: string;
    accessPort?: string;
    loginName?: string;
    operatingSystem?: string;
    isCreate?: boolean;
}
