module AssetsUtil
 
  def self.assets_url
    self.config["environments"][Rails.env]["assets"]
  end
  
  def self.server_host
    self.config["environments"][Rails.env]["host"]
  end
 
  def self.config
    @@config ||= YAML.load_file(File.join(Rails.root, 'config', 'assets.yml'))
 
    @@config
  end
 
  def self.images
    Dir.glob(Rails.root.join("app/assets/images/**/*.*")).map do |path| 
      path.gsub(Rails.root.join("app/assets/images/").to_s, "")
    end
  end
end