import instance from '../../Api/api'

export const APIEndpoint = () => {
    return {
        GetMissionInDay: () => instance.get("Home/GetMissionInDay" ),
        CheckFinish: item => instance.post("Home/CheckFinish",item)
    }
}