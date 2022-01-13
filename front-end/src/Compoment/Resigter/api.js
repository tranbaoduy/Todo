import instance from '../../Api/api'

export const APIEndpoint = () => {
    return {
        Insert: newRecord => instance.post("User/Insert",newRecord),
        Login:  User => instance.post("User/Login",User)
    }
}