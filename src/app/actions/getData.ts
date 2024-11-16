// app/actions/getData.js
export async function getData() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    return res.json();
}