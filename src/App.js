import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import Header from "./components/Header"
import ImageUpload from "./components/ImageUpload"
import Post from "./components/Post"
import { db } from "./firebase"

function App() {
	const [posts, setPosts] = useState([])
	const [user, setUser] = useState(null)



	const postCollectionRef = collection(db, "posts")
	const q = query(postCollectionRef, orderBy("timestamp", "desc"))

	useEffect(() => {
		onSnapshot(q, (snapshot) => {
			setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		})
	}, [])

	return (
		<div className="app">
			<Header
				user={user}
				setUser={setUser}
/>
			<div className="app__posts">
				{posts.map((post) => (
					<Post
						key={post.id}
						image={post.image}
						username={post.username}
						caption={post.caption}
						postId={post.id}
						user={user}
					/>
				))}
			</div>
			{user && <ImageUpload user={user}  />}
		</div>
	)
}

export default App
