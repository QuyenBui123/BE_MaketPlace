import json
from pymongo import MongoClient
from flask_cors import CORS
from flask import Flask, request, jsonify
from datetime import datetime

client = MongoClient("mongodb+srv://nguyenhuuthuat:Thuat123@cluster0.cs9d8wh.mongodb.net/twitter-dev?retryWrites=true&w=majority")
db = client['Cluster1']

app = Flask(__name__)
CORS(app)

@app.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()
    wallet_address = data.get('wallet_address')
   

    # Kiểm tra xem người dùng đã tồn tại chưa
    existing_user = db.users.find_one({'wallet_address': wallet_address})
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400

    # Tạo người dùng mới
    new_user = {
        'name': "",
        'avatar': "",
        'wallet_address': wallet_address,
        'created_at': datetime.utcnow(),
        'cover_photo': "",
        "description": "",
        'favorites': [] 
    }

    # Lưu vào MongoDB
    result = db.users.insert_one(new_user)

    # Convert ObjectId to string
    new_user['_id'] = str(result.inserted_id)

    return jsonify({'message': 'User created successfully', 'user': new_user}), 201

@app.route('/update_avatar/<string:wallet_address>', methods=['PUT'])
def update_avatar(wallet_address):
    data = request.get_json()
    new_avatar = data.get('new_avatar')

    # Kiểm tra xem người dùng có tồn tại không
    existing_user = db.users.find_one({'wallet_address': wallet_address})
    if not existing_user:
        return jsonify({'error': 'User not found'}), 404

    # Update avatar
    db.users.update_one({'wallet_address': wallet_address}, {'$set': {'avatar': new_avatar}})

    # Fetch the updated user
    updated_user = db.users.find_one({'wallet_address': wallet_address})

    # Convert ObjectId to string
    updated_user['_id'] = str(updated_user['_id'])

    return jsonify({'message': 'Avatar updated successfully', 'user': updated_user}), 200

@app.route('/update_cover_photo/<string:wallet_address>', methods=['PUT'])
def update_cover_photo(wallet_address):
    data = request.get_json()
    new_cover_photo = data.get('new_cover_photo')

    # Kiểm tra xem người dùng có tồn tại không
    existing_user = db.users.find_one({'wallet_address': wallet_address})
    if not existing_user:
        return jsonify({'error': 'User not found'}), 404

    # Update cover photo
    db.users.update_one({'wallet_address': wallet_address}, {'$set': {'cover_photo': new_cover_photo}})

    # Fetch the updated user
    updated_user = db.users.find_one({'wallet_address': wallet_address})

    # Convert ObjectId to string
    updated_user['_id'] = str(updated_user['_id'])

    return jsonify({'message': 'Cover photo updated successfully', 'user': updated_user}), 200

@app.route('/update_username/<string:wallet_address>', methods=['PUT'])
def update_username(wallet_address):
    data = request.get_json()
    
    body_data = json.loads(data.get('body', '{}'))
    new_username = body_data.get('name')
    
    # log new_username
    print(new_username)

    # Kiểm tra xem người dùng có tồn tại không
    existing_user = db.users.find_one({'wallet_address': wallet_address})
    if not existing_user:
        return jsonify({'error': 'User not found'}), 404

    # Update username
    db.users.update_one({'wallet_address': wallet_address}, {'$set': {'name': new_username}})

    # Fetch the updated user
    updated_user = db.users.find_one({'wallet_address': wallet_address})

    # Convert ObjectId to string
    updated_user['_id'] = str(updated_user['_id'])

    return jsonify({'message': 'Username updated successfully', 'user': updated_user}), 200

# Update information
@app.route('/update_info/<string:wallet_address>', methods=['PUT'])
def update_info(wallet_address):
    data = request.get_json()
    
    body_data = json.loads(data.get('body', '{}'))
    
    # log body_data
    print(body_data)

    # Kiểm tra xem người dùng có tồn tại không
    existing_user = db.users.find_one({'wallet_address': wallet_address})
    if not existing_user:
        return jsonify({'error': 'User not found'}), 404

    # Update user data
    db.users.update_one({'wallet_address': wallet_address}, {'$set': body_data})

    # Fetch the updated user
    updated_user = db.users.find_one({'wallet_address': wallet_address})

    # Convert ObjectId to string
    updated_user['_id'] = str(updated_user['_id'])

    return jsonify({'message': 'User updated successfully', 'user': updated_user}), 200

@app.route('/get_user/<wallet_address>', methods=['GET'])
def get_user(wallet_address):
    try:
        user = db.users.find_one({'wallet_address': wallet_address})
        if user:
            user['_id'] = str(user['_id'])
            return jsonify({'user': user}), 200
        else:
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        app.logger.error(f'Error fetching user: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/add_to_cart/<string:wallet_address>', methods=['POST'])
def add_to_cart(wallet_address):
    data = request.get_json()
    item_info = {
        'description': data.get('description'),
        'image': data.get('image'),
        'itemId': data.get('itemId'),
        'name': data.get('name'),
        'owner': data.get('owner'),
        'price': data.get('price'),
        'seller': data.get('seller')
    }

    # Tìm người dùng theo địa chỉ ví
    user_cart = db.carts.find_one({'wallet_address': wallet_address})

    if not user_cart:
        # Nếu người dùng chưa có giỏ hàng, tạo một giỏ hàng mới
        user_cart = {'wallet_address': wallet_address, 'cart': []}

    # Kiểm tra xem item đã được thêm vào giỏ hàng chưa
    if item_info not in user_cart['cart']:
        # Thêm thông tin item vào mảng cart
        user_cart['cart'].append(item_info)

        # Cập nhật hoặc thêm giỏ hàng vào cơ sở dữ liệu
        db.carts.update_one({'wallet_address': wallet_address}, {'$set': user_cart}, upsert=True)

        return jsonify({'message': 'Item added to cart successfully'}), 200
    else:
        return jsonify({'error': 'Item already in cart'}), 400
    
# Route để lấy thông tin giỏ hàng dựa trên địa chỉ ví
@app.route('/get_cart/<string:wallet_address>', methods=['GET'])
def get_cart(wallet_address):
    # Tìm giỏ hàng dựa trên địa chỉ ví
    user_cart = db.carts.find_one({'wallet_address': wallet_address})

    if user_cart:
        # Nếu giỏ hàng tồn tại, trả về thông tin giỏ hàng
        return jsonify({'cart': user_cart['cart']}), 200
    else:
        # Nếu không tìm thấy giỏ hàng, trả về thông báo lỗi
        return jsonify({'error': 'Cart not found'}), 404
    
@app.route('/clear_cart/<string:wallet_address>', methods=['DELETE'])
def clear_cart(wallet_address):
    # Tìm giỏ hàng dựa trên địa chỉ ví
    user_cart = db.carts.find_one({'wallet_address': wallet_address})

    if user_cart:
        db.carts.update_one({'wallet_address': wallet_address}, {'$set': {'cart': []}})

        return jsonify({'message': 'Cart cleared successfully'}), 200
    else:
        return jsonify({'error': 'Cart not found'}), 404
    
# Route để xóa một mục từ giỏ hàng dựa trên địa chỉ ví và itemId
@app.route('/remove_from_cart/<string:wallet_address>/<int:item_id>', methods=['DELETE'])
def remove_from_cart(wallet_address, item_id):
    # Tìm giỏ hàng dựa trên địa chỉ ví
    user_cart = db.carts.find_one({'wallet_address': wallet_address})

    if user_cart:
        # Lọc ra mục cần xóa từ giỏ hàng
        updated_cart = [item for item in user_cart['cart'] if item['itemId'] != item_id]
        db.carts.update_one({'wallet_address': wallet_address}, {'$set': {'cart': updated_cart}})

        return jsonify({'message': 'Item removed from cart successfully'}), 200
    else:
        return jsonify({'error': 'Cart not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)