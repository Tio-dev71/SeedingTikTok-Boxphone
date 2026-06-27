from app.core.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.live_session import LiveSession
from app.models.comment_template import CommentTemplate
from app.core.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create admin user if not exists
    admin = db.query(User).filter(User.email == "admin@toolsseeding.local").first()
    if not admin:
        admin = User(
            full_name="Admin User",
            email="admin@toolsseeding.local",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

    # Create coordinator and operator
    coordinator = db.query(User).filter(User.email == "coord@toolsseeding.local").first()
    if not coordinator:
        coordinator = User(
            full_name="Coordinator User",
            email="coord@toolsseeding.local",
            password_hash=get_password_hash("coord123"),
            role="coordinator"
        )
        db.add(coordinator)
    
    operator = db.query(User).filter(User.email == "operator@toolsseeding.local").first()
    if not operator:
        operator = User(
            full_name="Operator User",
            email="operator@toolsseeding.local",
            password_hash=get_password_hash("operator123"),
            role="operator"
        )
        db.add(operator)
    
    db.commit()

    # Create demo session
    session = db.query(LiveSession).first()
    if not session:
        session = LiveSession(
            title="Demo Session 1",
            tiktok_live_url="https://tiktok.com/@demo/live",
            status="preparing",
            created_by=admin.id
        )
        db.add(session)
        db.commit()

    # Create some templates
    template = db.query(CommentTemplate).first()
    if not template:
        templates = [
            CommentTemplate(content="OK để nhận giá ưu đãi", target_group="engagement", reminder_interval_seconds=300, priority="high", created_by=admin.id),
            CommentTemplate(content="Mọi người chia sẻ live giúp shop nha", target_group="engagement", reminder_interval_seconds=600, priority="medium", created_by=admin.id),
            CommentTemplate(content="Ai cần tư vấn size comment chiều cao cân nặng ạ", target_group="product_question", reminder_interval_seconds=900, priority="low", created_by=admin.id)
        ]
        db.bulk_save_objects(templates)
        db.commit()
    
    print("Database seeded successfully.")
    db.close()

if __name__ == "__main__":
    seed_db()
