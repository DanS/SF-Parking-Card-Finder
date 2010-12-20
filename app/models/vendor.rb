class Vendor < ActiveRecord::Base

  def self.nearest(latLng)
    given_lat = latLng[:lat]
    given_lng = latLng[:lng]
    find_by_sql("
    SELECT *, ((#{given_lat} - lat) * (#{given_lat} - lat)) + ((#{given_lng} - lng) * (#{given_lng} - lng)) AS Distance
    FROM vendors
    ORDER BY Distance ASC
    LIMIT 3")
  end

end


