require 'open-uri'
require 'rexml/document'

#heroku wants a task named cron for the daily cron job to run
task :cron => [:google_geocode, :environment]

# retrieve geocode information for all records in the stores table
task :google_geocode => [:fetch_vendors, :environment] do
  api_key = ENV['PARKING_CARD_KEY']
  accepted, rejected = 0, 0

  Vendor.find(:all).each do |vendor|
    address = "#{vendor.street} #{vendor.city_state}"
    puts "\nVendor #{vendor.vendor}"
    puts "Source Address: #{address}"
    xml=open("http://maps.google.com/maps/geo?q=#{
        CGI.escape(address)}&output=xml&key=#{api_key}").read
    doc=REXML::Document.new(xml)

    puts "Status: "+doc.elements['//kml/Response/Status/code'].text

    if doc.elements['//kml/Response/Status/code'].text != '200'
      puts "Unable to parse Google response for #{vendor.vendor}"
    else
      doc.root.each_element('//Response') do |response|
        response.each_element('//Placemark') do |place|
          lng, lat = place.elements['//coordinates'].text.split(',')
          vendor.lng = lng
          vendor.lat = lat
          #reject unreasonable coordinates
          if 37.9 > vendor.lat && vendor.lat > 37.6 && -122.35 > vendor.lng && vendor.lng > -122.5
            vendor.save!
            accepted += 1
          else
            Vendor.delete(vendor.id)
            puts '*' * 10 + ' REJECTED COORDINATES ' + '*' * 10
            rejected += 1
          end
          puts "Result Address: " << place.elements['//address'].text
          puts " Latitude: #{lat}"
          puts " Longitude: #{lng}"
        end
        puts "\nAccepted:#{accepted}, Rejected:#{rejected}"
      end
    end
  end
end
