import { useRouter } from "next/router"
import { useSelector } from 'react-redux'

export default function Page({params}) {
    const router = useRouter();
    const { slug } = router.query;
    const user = useSelector(state => {
        return state.userState.user
    })
    console.log("user: ", user)
      
      // const [projectList, setProjectList] = useState(useSelector(state => {
      //   return state.baseState.projectList
      // }))
    
    const projectList = useSelector((state) => {
        return state.baseState.projectList
    })
    console.log("projectList: ", projectList)

    return(
        <>
            <div>
                Hello world { slug }
            </div>
        </>
    )
}