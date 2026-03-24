from cryptography.fernet import Fernet

def create_key():
    key = Fernet.generate_key()
    with open("secret.key", "wb") as f:
        f.write(key)

def load_key():
    return open("secret.key", "rb").read()

def encrypt_msg(msg):
    key = load_key()
    f = Fernet(key)
    encrypted = f.encrypt(msg.encode())
    return encrypted

def decrypt_msg(token):
    key = load_key()
    f = Fernet(key)
    decrypted = f.decrypt(token)
    return decrypted.decode()

create_key()

text = "Hello Neel"
enc = encrypt_msg(text)
print("Encrypted:", enc)

dec = decrypt_msg(enc)
print("Decrypted:", dec)