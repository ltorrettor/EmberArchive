from backend import create_app

if __name__ == '__main__':
    print('Visit http://localhost:8000/index.html for the player demo')
    app = create_app()
    app.run(host='0.0.0.0', port=8000, debug=False)
