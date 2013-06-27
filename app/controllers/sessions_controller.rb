class SessionsController < Devise::SessionsController
    prepend_before_filter :require_no_authentication, :only => [ :new, :create ]
    prepend_before_filter :allow_params_authentication!, :only => :create
    prepend_before_filter { request.env["devise.skip_timeout"] = true }

    # GET /resource/sign_in
    def new
      self.resource = resource_class.new(sign_in_params)
      clean_up_passwords(resource)
      respond_with(resource, serialize_options(resource))
    end

    # POST /resource/sign_in
    def create
      resource = warden.authenticate!(:scope => resource_name, :recall => :failure)

      return sign_in_and_redirect(resource_name, resource)
    end
    
    def sign_in_and_redirect(resource_or_scope, resource=nil)
      scope = Devise::Mapping.find_scope!(resource_or_scope)
      resource ||= resource_or_scope
      sign_in(scope, resource) unless warden.user(scope) == resource
      return render json: { user: resource }
    end
 
    def failure
      return render json: resource, status: 422
    end

    # DELETE /resource/sign_out
    def destroy
      redirect_path = after_sign_out_path_for(resource_name)
      signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
      set_flash_message :notice, :signed_out if signed_out && is_navigational_format?

      # We actually need to hardcode this as Rails default responder doesn't
      # support returning empty response on GET request
      respond_to do |format|
        format.json { render json: signed_out }
        format.any(*navigational_formats) { redirect_to redirect_path }
      end
    end

protected
    def sign_in_params
      devise_parameter_sanitizer.for(:sign_in)
    end

    def serialize_options(resource)
      methods = resource_class.authentication_keys.dup
      methods = methods.keys if methods.is_a?(Hash)
      methods << :password if resource.respond_to?(:password)
      { :methods => methods, :only => [:password] }
    end

    def auth_options
      { :scope => resource_name, :recall => "#{controller_path}#new" }
    end
  end