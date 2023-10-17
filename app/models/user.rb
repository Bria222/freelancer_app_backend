class User < ApplicationRecord
    validates :name, presence: true
    validates :email, uniqueness: true, presence: true
    validates :password,  presence: true
    validates :phone_number, presence: true
    has_one :supplier
    has_one_attached :avatar
    def admin?
     role == "admin"
    end

    def supplier?
      role == "supplier"
    end

end
