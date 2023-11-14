from flask import Blueprint, jsonify, session, request
from ..models import Review, ReviewImage, db
from flask_login import current_user, login_required

reviews_routes = Blueprint('reviews', __name__)


# Edit a Review By Review Id

@reviews_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def edit_review_by_id(review_id):
  current_review = Review.query.get(review_id)
  if not current_review:
    return{"message" : "review does not exist"}
  elif current_user.id == current_review.user_id:
    data = request.get_json()
    current_review.review = data.get('review')
    current_review.star_rating = data.get('stars')

    db.session.commit()

    return current_review.to_dict()
  else:
    return {"message":"current user does not own this review"}


# Delete a Review By Review Id


@reviews_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review_by_id(review_id):
  current_review = Review.query.get(review_id)

  if not current_review:
    return jsonify({"message": "Review couldn't be found"})
  elif current_user.id == current_review.user_id:
    ReviewImage.query.filter_by(review_id = review_id).delete()

    db.session.delete(current_review)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"})
  else:
    return jsonify({"message": "current user does not own this review"})


# Add A Review Image


@reviews_routes.route('/<int:review_id>/images', methods=['POST'])
@login_required
def add_review_image(review_id):
  data = request.get_json()

  current_review = Review.query.get(review_id)

  if not current_review:
     return jsonify({"message": "Review couldn't be found"})
  elif current_user.id == current_review.user_id:
     new_image = ReviewImage(review_id = review_id, image_url = data.get("image_url"))

     db.session.add(new_image)
     db.session.commit()

     return new_image.to_dict()
  else:
    return jsonify({"message": "current user does not own this review"})


# Delete A Review Image


@reviews_routes.route('/<int:review_id>/images/<int:image_id>', methods=['DELETE'])
@login_required
def delete_review_image(review_id, image_id):
  current_review = Review.query.get(review_id)
  current_image = ReviewImage.query.get(image_id)
  if not current_review:
    return jsonify({"message": "Review couldn't be found"})
  elif not current_image:
    return jsonify({"message": "No review image by that id."})
  elif current_user.id == current_review.user_id:
    db.session.delete(current_image)
    db.session.commit()
    return jsonify({"message": "Review image deleted successfully."})
  else:
    return jsonify({"message": "current user does not own this review"})
