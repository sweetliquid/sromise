import Promise from './Promise'

document.getElementById('app').innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel 
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`

new Promise(resolve => {
  setTimeout(() => resolve(100), 5000)
})
  .then(value => {
    console.log(`My promise: ${value}`)
    return 'done'
  })
  .then(msg => {
    console.log(`the state is ${msg} now`)
  })
