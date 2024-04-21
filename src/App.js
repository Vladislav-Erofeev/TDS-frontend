import {Route, Routes} from "react-router";
import ClassifierPage from "./pages/ClassifierPage";
import LayerPage from "./pages/LayerPage";
import Header from "./components/Header";


function App() {
    return (
        <>
            <Routes>
                <Route path={'/'} element={<Header />}>
                    <Route path={'classifier'}>
                        <Route element={<ClassifierPage/>} index/>
                        <Route path={'layers/:id'} element={<LayerPage/>}/>
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
