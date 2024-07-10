module.exports = async (ami, event) => {
  console.log('MessageWaiting event received')
  console.log(JSON.stringify(event, null, 2))
}
