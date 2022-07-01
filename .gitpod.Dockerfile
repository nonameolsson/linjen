FROM gitpod/workspace-full:2022-06-20-19-54-55

# Install Fly
#RUN curl -L https://fly.io/install.sh | sh
#ENV FLYCTL_INSTALL="/home/gitpod/.fly"
ENV PATH="$FLYCTL_INSTALL/bin:$PATH"

# Install GitHub CLI
RUN brew install gh

# Install PlanetScale

USER gitpod
# trunk-ignore(hadolint/DL3004)
RUN wget --progress=dot:giga https://github.com/planetscale/cli/releases/download/v0.101.0/pscale_0.101.0_linux_amd64.deb \
  && sudo dpkg -i pscale_0.101.0_linux_amd64.deb
