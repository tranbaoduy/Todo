import instance from '../../Api/api'

export const APIEndpoint = () => {
    return {
        Paging : data => instance.post("Todo/Paging", data),
        Insert:  newRecord =>  instance.post("Todo/Insert",newRecord),
        Update: newRecode => instance.post("Todo/Update",newRecode),
        getLstJob: NameTodo => instance.get("Todo/getLstJob/" + NameTodo),
        Delete: NameTodo => instance.delete("Todo/Delete/" + NameTodo)
    }
}