from app.models import db, Product, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_products():
    product_1 = Product(name="Coffee Mug", description="Personlizable coffee or tea mug. 16 ounces.",
                        quantity=50, price=19.99, preview_image_url="https://i.fbcd.co/products/original/38ad33f004a41ea4b6211c21c1eb6658546ab25ab1d0151d418268010c967b41.jpg")
    product_2 = Product(name="Coasters", description="Set of 6 silicone coasters. Multicolored.",
                        quantity=35, price=12.95, preview_image_url="https://images.cults3d.com/ENA_mdelDke_7JFWug25L6g9-cs=/246x246/filters:no_upscale()/https://files.cults3d.com/uploaders/7282067/illustration-file/4e0a12f4-2cf5-4491-a31e-fc2ee8bc3e1c/CITRUS%20COASTERS.jpg")
    product_3 = Product(name="Ring Dish", description="Ring and jewlery dish. Measures approximately 4 inches by 6 inches.",
                        quantity=100, price=28.97, preview_image_url="https://guudguuds.com/wp-content/uploads/2020/12/Heart-Ring-Dish.jpg")

    db.session.add(product_1)
    db.session.add(product_2)
    db.session.add(product_3)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_products():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM products"))

    db.session.commit()
