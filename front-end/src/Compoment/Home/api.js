import instance from '../../Api/api'

export const APIEndpoint = () => {
    return {
        GetMissionInDay: () => instance.get("Home/GetMissionInDay" ),
    }
}