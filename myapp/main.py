"""Main entry point for myapp — starts the API server."""

import uvicorn


def main():
    print("Starting myapp API server on http://localhost:8000")
    print("  Docs: http://localhost:8000/docs")
    uvicorn.run("myapp.app:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
