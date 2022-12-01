import React, { useState, useEffect } from "react"
import Avatar from "@mui/material/Avatar"
import { collection, onSnapshot, addDoc, Timestamp, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"

export default function Post({ image, username, caption, postId, user }) {
	const [comments, setComments] = useState([])
	const [comment, setComment] = useState("")

	const postComment = (e) => {
		e.preventDefault()
		const postCollectionRef = collection(db, "posts", postId, "comments")
		addDoc(postCollectionRef, {
			username: user.displayName,
			text: comment,
			timestamp: Timestamp.now()
		})
		setComment("")
	}

	useEffect(() => {
		let unsubscribe

		if (postId) {
			const commentCollectionRef = collection(db, "posts", postId, "comments")
			const q = query(commentCollectionRef, orderBy("timestamp", "desc"))
			unsubscribe = onSnapshot(q, (snapshot) => {
				setComments(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
			})
		}

		return () => {
			unsubscribe()
		}
	}, [postId])

	return (
		<div className="post">
			<div className="post__header">
				<Avatar
					className="post__avatar"
					alt={username}
					src="static/images/avatar/1.jpg"
				/>
				<h3>{username}</h3>
			</div>
			<img
				className="post__image"
				src={image}
			/>

			<h4 className="post__text">
				<strong>@{username}</strong> {caption}
			</h4>
			<div className="post__comments">
				{comments?.map((comment) => (
					<p
						key={comment.id}
						className="post__comment"
					>
						<b>@{comment.username}</b> {comment.text}
					</p>
				))}
			</div>
			{user && (
				<form className="post__commentBox">
					<input
						className="post__input"
						type="text"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Write a comment..."
					/>
					<button
						disabled={!comment}
						className="post__button"
						type="submit"
						onClick={postComment}
					>
						Post
					</button>
				</form>
			)}
		</div>
	)
}
