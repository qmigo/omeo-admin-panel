import { useEffect } from 'react'
import db from './firebase'
import './App.css'
import { collection, getDocs } from 'firebase/firestore';
import { useState } from 'react';
import { produce } from 'immer';
import axios from 'axios';

function App()
{       
 const [defaultOrder, setDefaultOrder] = useState({
    retailerId: null,
    orderId: null,
    statusCode: null,
    userId: null,
    associatedOrderId: null,
    retailerLocation: null,
    pharmacyName: null,
    pharmacyAddress: null
 });

 const [allOrders, setAllOrders] = useState([]);
 const [allRetailers, setAllRetailers] = useState([]);
 const [statusCode, setStatusCode] = useState();
 const [selectedOrder, setSelectedOrder] = useState(-1);
 const [selectedRetailer, setSelectedRetailer] = useState(-1);

 useEffect(()=>{
    async function fetchDocs(){
        const orders = []
        const userSnapshot = await getDocs(collection(db, "Users"));
        userSnapshot.forEach(async (user) => {
            const orderSnapshot = await getDocs(collection(db, `Users/${user.id}/Orders`))
            orderSnapshot.forEach((order)=>{
                const {orderId, userId, associatedOrderId, statusCode, timeStamp} = order.data();
                const date = new Date(timeStamp);
                const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                if(statusCode>=2 && statusCode<5 && timeStamp>sevenDaysAgo)
                {
                    orders.push({orderId, userId, associatedOrderId, statusCode, timeStamp, date})
                }
            })
        });

        const retailerSnapshot = await getDocs(collection(db, "Retailers"));
        const retailers = []
        retailerSnapshot.forEach((retailer)=>{
            const {latlng:retailerLocation, pharmacyName, pharmacyAddress, ownerName} = retailer.data();
            retailers.push({retailerId: retailer.id, retailerLocation, pharmacyAddress, pharmacyName, ownerName})
        })

        setTimeout(()=>{
            orders.sort((a,b)=>{
                if(a.timeStamp < b.timeStamp)return 1;
                return -1;
            })
            setAllOrders(orders)
            setAllRetailers(retailers)
        },1000)
    }
    fetchDocs()
    
 },[])

 async function updateOrderUser(order, index){
    setSelectedOrder(index)
    const nextState = produce(order, draft => {
        draft.orderId = order.orderId,
        draft.userId = order.userId,
        draft.associatedOrderId = order.associatedOrderId,
        draft.statusCode = order.statusCode,
        draft.retailerId = defaultOrder.retailerId,
        draft.retailerLocation = defaultOrder.retailerLocation,
        draft.pharmacyName = defaultOrder.pharmacyName,
        draft.pharmacyAddress = defaultOrder.pharmacyAddress
    })

    setDefaultOrder(nextState)
 }

 async function updateOrder()
 {  
    try {
        if(!isNumeric(statusCode))
        {
            alert("StatusCode should be a number");
            return;
        }
        const fields = Object.keys(defaultOrder)
        let flag = 0;
        fields.map((item)=>{
            if(defaultOrder[item]===null)
            {
                flag = flag || 1;
            }
        })
        if(flag===1)
        {
            alert("All fields are necessary")
            return
        }
    
        const {data} = await axios.post("https://asia-south1-fir-edf55.cloudfunctions.net/updateStatusCode",{
            data:{...defaultOrder, statusCode}
        })

        console.log(data);
        window.location.reload(false);
        
    } catch (error) {
        console.log(error)
        alert(error.response.data.msg)
        alert("Invalid status code")
    }
 }

 async function updateOrderRetailer(retailer, index){

    setSelectedRetailer(index)
    const nextState = produce(retailer, draft => {
        draft.orderId = defaultOrder.orderId,
        draft.userId = defaultOrder.userId,
        draft.associatedOrderId = defaultOrder.associatedOrderId,
        draft.statusCode = defaultOrder.statusCode,
        draft.retailerId = retailer.retailerId,
        draft.retailerLocation = retailer.retailerLocation,
        draft.pharmacyName = retailer.pharmacyName,
        draft.pharmacyAddress = retailer.pharmacyAddress
    })

    setDefaultOrder(nextState)
 }

 function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

 return (
    <div className='app'>
        <div className='Orders'>
            <h4 className='mx-2 my-2'>Orders</h4>
            <hr />
        {   
            allOrders.length ? allOrders.map((order, index)=>(
                <div className={`strip strip-${selectedOrder===index}`} onClick={()=>{updateOrderUser(order, index)}}>{order.associatedOrderId} <hr /> {order.orderId} <hr /> {order.date.toLocaleString()} </div>
            )):
            <h4 className='mx-2'>Loading ...</h4>
        }
        </div>

        <div className="Retailers">
            <h4 className='mx-2 my-2'>Retailers</h4>
            <hr />
        {
            allRetailers.length ? allRetailers.map((retailer, index)=>(
                <div className={`strip strip-${selectedRetailer===index}`} onClick={()=>{updateOrderRetailer(retailer, index)}}>{retailer.retailerId} <hr /> {retailer.ownerName}</div>
            )):
            <h4 className='mx-2'>Loading ...</h4>

        }
        </div>

        <div className="UpdateForm">
            <h4 className='mx-2 my-2'>Update Form</h4>
            <div>Order Id : <span> {defaultOrder?.orderId} </span></div>
            <div>Associated Order Id : <span>{defaultOrder?.associatedOrderId} </span></div>
            <div>UserId : <span>{defaultOrder?.userId}</span></div>
            <div>RetailerId : <span>{defaultOrder?.retailerId}</span></div>
            <div>Retailer Location : <span>{defaultOrder?.retailerLocation}</span></div>
            <div>Pharmacy Address :<br /> <br /> <span>{defaultOrder?.pharmacyAddress}</span></div>
            <div>Pharmacy Name :<span>{defaultOrder?.pharmacyName}</span></div>
            <div>Previous Status Code :<span>{defaultOrder?.statusCode}</span></div>
            <div>New Status Code: <span>{statusCode}</span></div>
            <input className="mx-auto" type="text" placeholder="Type in new Status Code " onChange={(e)=>{setStatusCode(e.target.value)}}/>
            <button className='btn btn-success my-2' onClick={updateOrder}>Update</button>
        </div>
    </div>
 )
}
export default App
