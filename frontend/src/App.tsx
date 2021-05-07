import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import Home from './pages/home/Home'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
import Posts from './pages/posts/Posts'
import PostPage from './pages/posts/post/Post'
import NewPost from './pages/posts/post/NewPost'
import { currentUser } from './lib/store'
import EditPost from './pages/posts/post/EditPost'

const AuthRoute = ({ path, to, exact, Component, ...props }: any) => {
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => {
        if (!currentUser) {
          return <Redirect to={to} />
        }
        return <Component user={currentUser} {...props} />
      }}
    ></Route>
  )
}

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet animated={false}>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/posts">
          <Posts />
        </Route>
        <AuthRoute exact path="/posts/new" Component={NewPost} to="/" />
        <AuthRoute exact path="/posts/:id/update" Component={EditPost} to="/" />
        <Route
          exact
          path="/post/:id"
          render={(props) => <PostPage {...props} />}
        ></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)

export default App
