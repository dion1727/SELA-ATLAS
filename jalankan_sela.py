import errno
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


def main():
    folder = Path(__file__).resolve().parent
    if not (folder / "index.html").is_file():
        raise SystemExit("Ekstrak seluruh ZIP terlebih dahulu agar index.html tersedia.")

    handler = partial(SimpleHTTPRequestHandler, directory=str(folder))
    try:
        server = LocalServer(("127.0.0.1", 8000), handler)
    except OSError as error:
        if error.errno != errno.EADDRINUSE and getattr(error, "winerror", None) not in (10013, 10048):
            raise
        server = LocalServer(("127.0.0.1", 0), handler)

    with server:
        url = f"http://127.0.0.1:{server.server_port}/"
        print(f"Atlas perjalanan Sela sedang berjalan di {url}", flush=True)
        print("Biarkan jendela ini terbuka. Tekan Ctrl+C untuk berhenti.", flush=True)
        try:
            webbrowser.open(url)
        except webbrowser.Error:
            print("Buka alamat di atas pada browser.")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


class LocalServer(ThreadingHTTPServer):
    allow_reuse_address = os.name != "nt"


if __name__ == "__main__":
    main()
