import instance from '../../Api/api'

export const APIEndpoint = () => {
    return {
        Insert: newRecord => instance.post("User/Insert",newRecord),
        Login: User => instance.post("User/Login",User),
        CheckUser: User => instance.post("User/CheckUser", User),
        CheckCode: User => instance.post("User/CheckCode", User),
        ChangePassWord: User => instance.post("User/ChangePassWord",User),
    }
}