exports.indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drive App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
        }

        header {
            background-color: #35424a;
            color: white;
            padding: 20px 0;
        }

        header a {
            color: white;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 16px;
            margin: 0 20px;
        }

        header ul {
            padding: 0;
            margin: 0;
            list-style: none;
            overflow: hidden;
            display: inline;
        }

        header li {
            float: left;
            display: inline;
            padding: 0 20px 0 20px;
        }

        .landing {
            text-align: center;
            padding: 100px 0;
        }

        .landing h1 {
            font-size: 50px;
            margin-bottom: 20px;
        }

        .landing p {
            font-size: 18px;
            color: #777;
        }

        .cta-button {
            display: inline-block;
            background-color: #e8491d;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            font-size: 18px;
            border-radius: 5px;
            margin-top: 20px;
            transition: background-color 0.3s;
        }

        .cta-button:hover {
            background-color: #d6360b;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div id="branding">
                <h1><span class="highlight">Drive</span> App</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Features</a></li>
                    <li><a href="#">Pricing</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <section class="landing">
        <div class="container">
            <h1>Your Ultimate Cloud Storage Solution</h1>
            <p>Securely store and access your files from anywhere, anytime.</p>
            <a href="https://frontend-jsgki2c54-addddd123.vercel.app/auth/login" class="cta-button">Get Started</a>
        </div>
    </section>
</body>
</html>
`
