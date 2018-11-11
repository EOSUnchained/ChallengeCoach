function createPost (state, payload, blockInfo, context) { //this upacks the info and then emits???
  const post = {
    _id: {
      timestamp: payload.data.timestamp,
      author: payload.data.author
    },
    author: payload.data.author,
    title: payload.data.title,
    content: payload.data.content,
    tag: payload.data.tag
  }
  context.socket.emit('createpost', post)
}

export default createPost
