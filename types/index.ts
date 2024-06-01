export { };

declare global {
    interface IUser{
        _id?:string;
        name?:string;
        password?:string;
        email?:string;
        uid?:string;
        roles?:number[];
        is_admin?:boolean;
        active?:boolean;
        softDeletet?:boolean;
        LastLoginAt?:string;
        refreshToken?:string;
        sAccessToken?:string;
        // _id?:string;
        // _id?:string;
        // _id?:string;
        // _id?:string;
    }
}