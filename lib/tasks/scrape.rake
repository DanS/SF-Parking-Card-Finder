desc "Fetch vendors from SFMTA site"
task :fetch_vendors => :environment do
  require 'rubygems'
  require 'nokogiri'
  require 'open-uri'

  Vendor.delete_all
  doc = Nokogiri::HTML(open("http://www.sfmta.com/cms/asystem/parkcardvend.php"))
  doc.css('td#bodytext table tr').each_with_index do |tr, i|
    unless i == 0
      vendor = Vendor.new
      row = tr.css("td")
      vendor.vendor     = row[0].text.strip
      vendor.street     = row[1].text.split('@').first.squeeze(' ').strip
      vendor.city_state = 'San Francisco, CA'
      vendor.items      = row[2].text.strip
      vendor.save!
    end
  end
end

