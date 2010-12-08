class Vendor < ActiveRecord::Base

  def self.nearest(latLng)
    find_by_sql("
    SELECT *, ((#{latLng[:lat]} - lat) * (#{latLng[:lat]} - lat)) + ((#{latLng[:lng]} - lng) * (#{latLng[:lng]} - lng)) AS Distance
    FROM vendors
    ORDER BY Distance ASC
    LIMIT 3 ")
  end

end


#  {:lat => 37.8809325, :lng => -122.2832706}