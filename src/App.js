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
import SuccessAlert from "./ui/SuccessAlert";
import ObjectsPage from "./pages/ObjectsPage";
import ErrorAlert from "./ui/ErrorAlert";
import RegisterPage from "./pages/RegisterPage";
import GeocodingPage from "./pages/GeocodingPage";
import ProjectsPage from "./pages/ProjectsPage";


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
                    <Route index element={<IndexPage/>}/>
                    <Route path={'map'} element={<MapPage/>}/>
                    <Route path={'classifier'}>
                        <Route element={<ClassifierPage/>} index/>
                        <Route path={'layers/:id/:name'} element={<LayerPage/>}/>
                    </Route>
                    <Route path={'geocoding'} element={<GeocodingPage/>}/>
                    <Route path={'objects'} element={<ObjectsPage/>}/>
                    <Route path={'profile'} element={<ProfilePage/>}/>
                    <Route path={'projects'} element={<ProjectsPage/>} />
                </Route>
                <Route path={'/login'} element={<LoginPage/>}/>
                <Route path={'/register'} element={<RegisterPage/>}/>
            </Routes>
            <SuccessAlert/>
            <ErrorAlert/>
        </>
    );
}

export default App;
