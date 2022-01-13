import instance from '../../Api/api'

export const APIEndpoint = () => {
    return {
        Paging : data => instance.post("Todo/Paging", data),
        Insert:  newRecord =>  instance.post("Todo/Insert",newRecord),
        Update: (id,newRecode) => instance.put("Todo/Update/" +id,newRecode),
        GetInformationList: GuiId => instance.get("Todo/GetInformationList/" + GuiId),
        Delete: NameTodo => instance.delete("Todo/Delete/" + NameTodo)
    }
}