"use client";

export default function PostsTemplate({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <header>
                <h1>Posts Header</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>Posts Footer</p>
            </footer>
        </div>
    );
}