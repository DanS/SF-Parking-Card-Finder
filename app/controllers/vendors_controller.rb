class VendorsController < ApplicationController
  # GET /list
  def list
    @vendors = Vendor.nearest(params).to_json
    respond_to do |format|
      format.json { render :layout => false,
                           :json   => @vendors }
    end
  end

  def listAll
    @vendors = Vendor.all
    respond_to do |format|
      format.json { render :layout => false,
                           :json   => @vendors }
    end
  end


end
