import instance from './Api/api'
import * as ServiceWorker from './service-worker' 
const APIEndpoint = () => {
  return {
    Getsubscrition: newRecord => instance.post("PushNotification/Getsubscrition",newRecord),
  }
}

export async function  SendsubscritionId(subscrition) {
  console.log('subscrition',subscrition);
    //  APIEndpoint().Getsubscrition(subscrition)
    //  .then(res => { console.log('res',res)} )
    //  .catch(err => { console.log('err',err)} )
};

export async function CheckandCreateSubscription(service)
{
  // console.log('service',service);
    // await service.pushManager.getSubscription()
    // .then(subscription => {
    //     console.log('subscription',subscription)
    // })
    // .catch(err => console.log(err))
}