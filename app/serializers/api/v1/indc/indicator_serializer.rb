module Api
  module V1
    module Indc
      class IndicatorSerializer < ActiveModel::Serializer
        attribute :id
        attribute :source
        attribute :name
        attribute :slug
        attribute :category_ids, if: -> { object.category_ids.length.positive? }
        attribute :labels
        attribute :locations

        def labels
          IndexedSerializer.serialize(
            object.labels,
            serializer: LabelSerializer,
            &:id
          )
        end

        def locations
          IndexedSerializer.serialize(
            object.values,
            serializer: ValueSerializer
          ) do |v|
            v.location.iso_code3
          end
        end
      end
    end
  end
end