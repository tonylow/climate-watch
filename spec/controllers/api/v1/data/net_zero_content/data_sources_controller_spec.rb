require 'rails_helper'

RSpec.describe Api::V1::Data::NetZeroContent::DataSourcesController, type: :controller do
  include_context 'Net Zero sources'

  describe 'GET index' do
    it 'renders data sources' do
      get :index
      expect(@response).to match_response_schema('ndc_content_data_sources')
    end
  end
end
