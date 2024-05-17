import { createBrowserRouter } from "react-router-dom";
import Coins from "./routes/Coins";

function Router() {
    return createBrowserRouter([
        {path: '/', element: <Coins />}
    ])
}

export default Router