class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :name, :email, :password, :role, :phone_number, :avatar

  def avatar
    if object.avatar.attached? && object.avatar.blob.present?
      url_for(object.avatar)
    end
  end
end
