import React from "react";

const Message = React.memo(({message})=> {
  return <p>{message}</p>
})

const ListItem = React.memo(({post}) =>{
  return (
    <li key={post.id}>
      <p>{post.title}</p>
    </li>
  )
})

const List = React.memo(({posts}) =>{
  console.log("list component rendering")
  return (
    <ul>
      {posts.map(post => (
        <ListItem key={post.id} post={post}/>
      ))}
    </ul>
  )
})

const B = ({message, posts}) => {
  console.log("B component rendering")
  const testFunction = () => {
  }
  return (
    <div>
      <h1>B Components</h1>
      <Message message={message}></Message>
      <List posts={posts} testFunction={testFunction()}/>
    </div>
  )
}
export default B;