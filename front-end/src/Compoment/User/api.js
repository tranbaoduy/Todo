import instance from '../../Api/api'

export const APIEndpoint = () => {
    return {
        Update: (id,User) => instance.put("User/Update/" + id, User),
        Patch: (id,User) => instance.patch("User/Patch/" + id, User),
        ChangePassWord: User => instance.post("User/ChangePassWord",User),
    }
}