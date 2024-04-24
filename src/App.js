import {Route, Routes} from "react-router";
import ClassifierPage from "./pages/ClassifierPage";
import LayerPage from "./pages/LayerPage";
import Header from "./components/Header";
import MapPage from "./pages/MapPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setUserAction} from "./redux/userReducer";
import {ProfileService} from "./services/ProfileService";
import {setLoadingAction} from "./redux/LoadReducer";
import IndexPage from "./pages/IndexPage";


function App() {
    const dispatch = useDispatch()
    useEffect(() => {
        let fetch = async () => {
            try {
                dispatch(setUserAction(await ProfileService.getProfile()))
            } catch (e) {
                dispatch(setUserAction(null))
            } finally {
                dispatch(setLoadingAction(false))
            }
        }
        fetch()
    }, [])
    return (
        <>
            <Routes>
                <Route path={'/'} element={<Header/>}>
                    <Route index element={<IndexPage />}/>
                    <Route path={'map'} element={<MapPage/>}/>
                    <Route path={'classifier'}>
                        <Route element={<ClassifierPage/>} index/>
                        <Route path={'layers/:id'} element={<LayerPage/>}/>
                    </Route>
                    <Route path={'profile'} element={<ProfilePage/>}/>
                </Route>
                <Route path={'/login'} element={<LoginPage/>}/>
            </Routes>
        </>
    );
}

export default App;
