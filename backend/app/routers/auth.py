"""Authentication routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, UserResponse, Token, UserUpdate, PreferencesUpdate
from ..utils.auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user account."""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        name=user_data.name,
        age=user_data.age,
        home_country=user_data.home_country,
        preferences={}
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create access token
    access_token = create_access_token(data={"sub": user.id})

    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password."""
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.id})

    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return UserResponse.model_validate(current_user)


@router.patch("/me", response_model=UserResponse)
async def update_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user information."""
    if user_data.name is not None:
        current_user.name = user_data.name
    if user_data.age is not None:
        current_user.age = user_data.age
    if user_data.home_country is not None:
        current_user.home_country = user_data.home_country

    db.commit()
    db.refresh(current_user)

    return UserResponse.model_validate(current_user)


@router.patch("/me/preferences", response_model=UserResponse)
async def update_preferences(
    preferences: PreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user preferences."""
    # Get current preferences or initialize empty dict
    current_prefs = current_user.preferences or {}

    # Update preferences
    if preferences.budget_per_day is not None:
        current_prefs["budget_per_day"] = preferences.budget_per_day
    if preferences.interests is not None:
        current_prefs["interests"] = preferences.interests
    if preferences.travel_style is not None:
        current_prefs["travel_style"] = preferences.travel_style
    if preferences.risk_tolerance is not None:
        current_prefs["risk_tolerance"] = preferences.risk_tolerance
    if preferences.dietary_restrictions is not None:
        current_prefs["dietary_restrictions"] = preferences.dietary_restrictions
    if preferences.accessibility_needs is not None:
        current_prefs["accessibility_needs"] = preferences.accessibility_needs
    if preferences.activity_preferences is not None:
        current_prefs["activity_preferences"] = preferences.activity_preferences

    current_user.preferences = current_prefs
    db.commit()
    db.refresh(current_user)

    return UserResponse.model_validate(current_user)
