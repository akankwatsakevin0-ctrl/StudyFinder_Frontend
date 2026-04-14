import hashlib
import sys

def generate_hash(password):
    return hashlib.sha256(password.encode()).hexdigest()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        password = input("Enter password to hash: ")
    
    hashed = generate_hash(password)
    print(f"\nPassword: {password}")
    print(f"SHA-256 Hash: {hashed}")
    print("\nCopy the hash above into your .env file.")
