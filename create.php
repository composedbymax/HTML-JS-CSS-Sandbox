<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create New Room</title>
    <link rel="stylesheet" href="/css/root.css">
    <style>
        body {
            background: var(--gradient);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color:var(--text);
        }
        .container {
            background-color: var(--dark);
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        input[type="text"] {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            outline: none;
            transition: border-color 0.3s;
        }
        input[type="text"]:focus {
            border-color: var(--accent);
        }
        button {
            padding: 12px;
            background-color: var(--accent);
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            color:var(--text);
        }
        button:hover {
            background-color: var(--accenth);
        }
        button:active {
            background-color: var(--accenth);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Create New Coding Room</h1>
        <form action="create_room.php" method="POST">
            <input type="text" name="room" 
                   placeholder="Room Name (letters, numbers, underscores)" 
                   pattern="[A-Za-z0-9_]+" required>
            <button type="submit">Create Room</button>
        </form>
    </div>
</body>
</html>
