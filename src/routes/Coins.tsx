import { useQuery } from "react-query";
import { fetchCoins } from "../api";


function Coins() {
    const {isLoading, data} = useQuery('coinIds',fetchCoins);
    console.log(data)
    return <>
    
    </>
}

export default Coins;