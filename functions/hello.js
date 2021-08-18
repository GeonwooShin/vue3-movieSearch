exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: 'GeonwooShin',
      age: 24,
      email: 'rjsdnslawkd@naver.com'
    })
  }
}